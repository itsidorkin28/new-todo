import React from 'react'
import { Todos } from '../features'

import { withLayout } from '../layout'


function App() {
    return <>
        <Todos />
    </>
}

export default withLayout(App)
