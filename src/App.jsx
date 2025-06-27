import React, { useState } from 'react'

const addToLocalStorage = (name, arr) => {
  localStorage.setItem(name, JSON.stringify(arr))
}

const removeFromLocalStorage = (name, id) => {

  let get = JSON.parse(localStorage.getItem(name))

  get = get.filter((item) => item.id !== id)

  addToLocalStorage(name, get)

}


const App = () => {

  const [value, setValue] = useState('');
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({
    status: '',
    color: '',
    visibility: 'hidden'
  });
  const [todos, setTodos] = useState(() => {
    const storedTasks = localStorage.getItem('todo');
    return storedTasks ? JSON.parse(storedTasks) : []
  });


  function handleEditTask(todo) {
    setValue(todo.task)
    setEditId(todo.id)
  }



  const handleDeleteTask = (objItem) => {
    setTodos(todos.filter((todo) => todo.id !== objItem.id))
    removeFromLocalStorage('todo', objItem.id)
    alertFn('Removed', 'pink', 'visible')
    setTimeout(() => {
      alertFn('none', 'none', 'hidden')
    }, 1000);
  }

  const handleCreateTask = (e) => {
    if (!editId && value) {
      e.preventDefault()
      const task = {
        id: new Date().getTime(),
        task: value
      }


      todos.push(task)
      addToLocalStorage('todo', todos)
      setValue('')
      alertFn('Added', 'lightblue', 'visible')
      setTimeout(() => {
        alertFn('none', 'none', 'hidden')
      }, 1000);
    } else if (editId && value) {
      e.preventDefault()
      const updatedTodos = todos.map(todo => {
        if (todo.id == editId) {
          return { ...todo, task: value }
        }
        return todo
      })

      setTodos(updatedTodos)
      addToLocalStorage('todo', updatedTodos)
      alertFn('Updated', 'lightblue', 'visible')
      setTimeout(() => {
        alertFn('none', 'none', 'hidden')
      }, 1000);
      setValue('')
      setEditId(false)
    } else {
      e.preventDefault()
      alertFn('EMPTY', 'pink', 'visible')
      setTimeout(() => {
        alertFn('none', 'none', 'hidden')
      }, 1000);
    }
  }


  const alertFn = (status, color, visibility) => {
    setAlert({
      status: status,
      color: color,
      visibility: visibility
    })
  }

  return (
    <div className='w-[400px] mx-auto my-32'>

      <div className='mb-4 w-full'>
        <p className='p-3 w-full text-xl' style={{ backgroundColor: alert.color, visibility: alert.visibility }}>Task {alert.status}</p>
      </div>

      <form className='' onSubmit={handleCreateTask}>
        <input className='border ml-12 md:ml-0 text-xl w-[200px] md:w-[300px] border-e-gray-400 p-4' placeholder='Enter Task' type="text" value={value} onChange={e => setValue(e.target.value)} />
        <input type="submit" className='px-2 bg-[#ccc] py-4 w-[80px] rounded-md md:w-[100px]' value="Submit" />
      </form>

      <ul>
        {todos.map((todo) => {
          return <li id={todo.id} className='my-4 w-fit text-2xl mx-auto' key={todo.id}>{todo.task}{' '}<button onClick={() => handleEditTask(todo)} className='bg-black px-2 py-1 rounded-xl text-lg text-white'>Edit</button>{' '}<button onClick={() => handleDeleteTask(todo)} className='bg-black px-2 py-1 rounded-xl text-lg text-white'>Delete</button></li>
        })}
      </ul>


    </div>
  )
}

export default App