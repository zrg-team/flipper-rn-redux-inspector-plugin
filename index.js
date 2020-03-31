import {
  FlipperPlugin,
  Button,
  DetailSidebar,
  FlexColumn,
  SearchableTable,
  Text,
  Panel,
  DataDescription,
  ManagedDataInspector
} from 'flipper'

function tryConvertToJson (value) {
  if (typeof value === 'string' && (
    value.startsWith('{') || value.startsWith('[')
  )) {
    try {
      return JSON.parse(value)
    } catch (e) { }
  }
  return value
}

function formatTimestamp (timestamp) {
  const date = new Date(timestamp)
  return `${date.getHours().toString().padStart(2, '0')}:${
    date.getMinutes().toString().padStart(2, '0'
  )}:${date.getSeconds().toString().padStart(2, '0')}.${
    date.getMilliseconds().toString().padStart(3, '0'
  )}`
}

const COLUMN_SIZE = {
  timeStamp: 100,
  actionType: 'flex'
}

const COLUMNS = {
  timeStamp: {
    value: 'Time'
  },
  actionType: {
    value: 'Action Type'
  }
}

class FlipperReduxInspectorPlugin extends FlipperPlugin {
  constructor (props) {
    super(props)
    this.id = 'RNReduxInspector'
    this.defaultPersistedState = {
      actions: []
    }
    this.state = {
      selectedIds: []
    }
    this.handleClear = this.handleClear.bind(this)
    this.handleRowHighlighted = this.handleRowHighlighted.bind(this)
  }

  static persistedStateReducer (
    persistedState,
    method,
    data
  ) {
    return {
      ...persistedState,
      actions: [
        ...persistedState.actions,
        data
      ]
    }
  }

  handleClear () {
    this.setState({ selectedIds: [] })
    this.props.setPersistedState({ actions: [] })
  }

  handleRowHighlighted (keys) {
    this.setState({ selectedIds: keys })
  }

  renderSidebar () {
    const { selectedIds } = this.state
    const selectedId = selectedIds.length !== 1 ? null : selectedIds[0]

    if (selectedId != null) {
      const { actions } = this.props.persistedState
      const selectedData = actions.find(v => v.uniqueId === selectedId)

      const {
        payload,
        prevState,
        nextState
      } = selectedData

      const parsedPayload = tryConvertToJson(payload)
      const parsedPrevState = tryConvertToJson(prevState)
      const parsedNextState = tryConvertToJson(nextState)

      return (
        <div>
          <Panel floating={false} heading='Payload'>
            {
              typeof parsedPayload !== 'object' ? <DataDescription type={typeof parsedPayload} value={parsedPayload} /> : (
                <ManagedDataInspector data={parsedPayload} expandRoot />
              )
            }
          </Panel>
          <Panel floating={false} heading='State'>
            {
              typeof parsedNextState !== 'object' ? <DataDescription type={typeof parsedNextState} value={parsedNextState} /> : (
                <ManagedDataInspector diff={parsedPrevState} data={parsedNextState} expandRoot />
              )
            }
          </Panel>
        </div>
      )
    } else {
      return null
    }
  };

  buildRow (row) {
    return {
      columns: {
        timeStamp: {
          value: <Text>{formatTimestamp(row.timeStamp)}</Text>,
          filterValue: row.timeStamp
        },
        actionType: {
          value: <Text>{row.actionType}</Text>,
          filterValue: row.actionType
        }
      },
      key: row.uniqueId,
      copyText: JSON.stringify(row),
      filterValue: `${row.actionType}`
    }
  }

  render () {
    const { actions } = this.props.persistedState
    const rows = actions.map(v => this.buildRow(v))

    return (
      <FlexColumn grow>
        <SearchableTable
          key={this.constructor.id}
          rowLineHeight={28}
          floating={false}
          multiline
          columnSizes={COLUMN_SIZE}
          columns={COLUMNS}
          onRowHighlighted={this.handleRowHighlighted}
          multiHighlight
          rows={rows}
          stickyBottom
          actions={<Button onClick={this.handleClear}>Clear</Button>}
        />
        <DetailSidebar>{this.renderSidebar()}</DetailSidebar>
      </FlexColumn>
    )
  }
}

export default FlipperReduxInspectorPlugin
