
import React, { memo } from 'react'
import {
  Text,
  Panel,
  DataDescription,
  ManagedDataInspector
} from 'flipper'

export default memo((props) => {
  const {
    actionType,
    payload,
    prevState,
    nextState
  } = props

  return (
    <>
      <Text style={{ fontSize: 20, padding: 10, fontWeight: 'bold' }}>
        {`💾 ${actionType}`.toUpperCase()}
      </Text>
      <Panel floating={false} heading='💼 Payload'>
        {
          typeof payload !== 'object'
            ? <DataDescription type={typeof payload} value={payload} />
            : <ManagedDataInspector data={payload} expandRoot />
        }
      </Panel>
      <Panel floating={false} heading='📑 Diff'>
        {
          typeof nextState !== 'object'
            ? <DataDescription type={typeof nextState} value={nextState} />
            : <ManagedDataInspector diff={prevState} data={nextState} expandRoot />
        }
      </Panel>
    </>
  )
})
