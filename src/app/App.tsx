import React from 'react'
import { Todos } from '../features'

import { withLayout } from '../layout'


function App() {
    console.log('App render')
    return <>
        <Todos />
    </>
}

export default withLayout(App)
