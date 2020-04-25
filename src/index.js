
import React from 'react'
import {
  Text,
  styled,
  Button,
  FlexColumn,
  FlipperPlugin,
  DetailSidebar,
  SearchableTable,
  DataDescription,
  ManagedDataInspector
} from 'flipper'
import { COLUMNS, COLUMN_SIZE, HELP_URL } from './config.js'
import { convertToJson, formatTimestamp } from './utils/format'
import SideBar from './components/SideBar'

const MainContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
})

const ActionsConatiner = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  flex: 1
})

const CurrentStateContainer = styled.div({
  width: '100%',
  height: 200,
  paddingTop: 5,
  paddingBottom: 5,
  paddingLeft: 10,
  paddingRight: 10,
  overflow: 'scroll',
  backgroundColor: 'rgb(246, 247, 249)'
})

class FlipperReduxInspectorPlugin extends FlipperPlugin {
  constructor (props) {
    super(props)
    this.id = 'FlipperReduxInspectorPlugin'
    this.state = {
      selectedIds: [],
      selectedData: null
    }
    this.handleHelp = this.handleHelp.bind(this)
    this.handleClear = this.handleClear.bind(this)
    this.handleRowHighlighted = this.handleRowHighlighted.bind(this)
  }

  static persistedStateReducer (
    persistedState,
    method,
    data
  ) {
    try {
      let currentState = persistedState.currentState || {}
      switch (method) {
        case 'action': {
          let lastPersistedActions = persistedState.actions
          if (!lastPersistedActions) {
            lastPersistedActions = []
          }
          currentState = data.nextState
          return {
            ...persistedState,
            currentState,
            actions: [
              ...lastPersistedActions,
              data
            ]
          }
        }
        default:
          return persistedState
      }
    } catch (err) {
    }
  }

  handleHelp () {
    window.open(HELP_URL, 'blank')
  }

  handleClear () {
    const { setPersistedState } = this.props
    this.setState({ selectedIds: [] })
    setPersistedState({ actions: [] })
  }

  handleRowHighlighted (keys) {
    const { persistedState = {} } = this.props
    const { selectedIds } = this.state

    const selectedId = keys.length !== 1 ? null : keys[0]
    if (selectedIds.includes(selectedIds)) {
      return this.setState({
        selectedIds: []
      })
    }
    const selectedData = persistedState.actions &&
      persistedState.actions.find(v => v.uniqueId === selectedId)

    const {
      payload,
      uniqueId,
      prevState,
      nextState,
      actionType
    } = selectedData

    this.setState({
      selectedIds: [selectedId],
      selectedData: {
        uniqueId,
        actionType,
        payload: convertToJson(payload),
        prevState: convertToJson(prevState),
        nextState: convertToJson(nextState)
      }
    })
  }

  renderSidebar () {
    const { selectedIds, selectedData } = this.state
    const selectedId = selectedIds[0]
    if (!selectedData || !selectedId) {
      return null
    }
    return (
      <SideBar {...selectedData} />
    )
  }

  buildRow (row) {
    return {
      columns: {
        timeStamp: {
          value: <Text>⏱️ {formatTimestamp(row.timeStamp)} ⏱️</Text>,
          filterValue: row.timeStamp
        },
        actionType: {
          value: <Text>🚀 {row.actionType}</Text>,
          filterValue: row.actionType
        },
        time: {
          value: <Text>⏳ {row.time || '0s'}</Text>,
          filterValue: row.time
        }
      },
      key: row.uniqueId,
      copyText: JSON.stringify(row, null, 2),
      filterValue: `${row.actionType}`
    }
  }

  render () {
    const { persistedState = {} } = this.props
    const { actions = [], currentState = {} } = persistedState
    const rows = actions.map(this.buildRow)

    return (
      <FlexColumn grow>
        <MainContainer>
          <Text style={{ fontSize: 17, padding: 5, paddingLeft: 10, paddingRight: 10, fontWeight: 'bold' }}>
            🏷️ Actions
          </Text>
          <ActionsConatiner>
            <SearchableTable
              key={this.id}
              rowLineHeight={28}
              floating={false}
              multiline
              columnSizes={COLUMN_SIZE}
              columns={COLUMNS}
              onRowHighlighted={this.handleRowHighlighted}
              multiHighlight
              rows={rows}
              stickyBottom
              actions={(
                <>
                  <Button onClick={this.handleClear}>🗑️ Clear</Button>
                  <Button onClick={this.handleHelp}>⛑️ Integration Guide</Button>
                </>
              )}
            />
          </ActionsConatiner>
          <Text style={{ fontSize: 17, padding: 5, paddingLeft: 10, paddingRight: 10, fontWeight: 'bold' }}>
            📖 State
          </Text>
          <CurrentStateContainer>
            {
              typeof currentState !== 'object'
                ? <DataDescription type={typeof payload} value={currentState} />
                : <ManagedDataInspector data={currentState} />
            }
          </CurrentStateContainer>
        </MainContainer>
        <DetailSidebar>{this.renderSidebar()}</DetailSidebar>
      </FlexColumn>
    )
  }
}

export default FlipperReduxInspectorPlugin
