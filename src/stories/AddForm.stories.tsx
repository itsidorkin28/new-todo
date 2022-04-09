import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { AddForm } from '../components'
import { action } from '@storybook/addon-actions'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Todos/AddForm',
    component: AddForm,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        onCreate: {
            description: 'callback'
        }
    },
} as ComponentMeta<typeof AddForm>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AddForm> = (args) => <AddForm {...args} />

export const AddFormStory = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
AddFormStory.args = {
    onCreate: action('onCreate')
}

