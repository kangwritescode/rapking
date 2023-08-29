import { Rap } from '@prisma/client'
import React from 'react'

interface RapsTabProps {
  raps?: Rap[] | null;
}

function RapsTab({raps}: RapsTabProps) {
  return (
    <div>{JSON.stringify(raps)}</div>
  )
}

export default RapsTab
