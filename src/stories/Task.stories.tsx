import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Task } from '../features/Task/Task'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Todos/Task',
    component: Task,
    args: {
        removeTask: action('removeTask'),
        changeTaskTitle: action('changeTaskTitle'),
        onChangeCheckbox: action('onChangeCheckbox'),
    }
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Task>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />

export const ActiveTaskStory = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
ActiveTaskStory.args = {
    task: {
        id: '1',
        title: 'Task',
        isDone: false,
        deadline: '',
        description: '',
        order: 0,
        status: 0,
        priority: 0,
        startDate: '',
        addedDate: '',
        todoListId: '1'
    }
}
export const CompletedTaskStory = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
CompletedTaskStory.args = {
    task: {
        id: '1',
        title: 'Task',
        isDone: true,
        deadline: '',
        description: '',
        order: 0,
        status: 0,
        priority: 0,
        startDate: '',
        addedDate: '',
        todoListId: '1'
    }
}

