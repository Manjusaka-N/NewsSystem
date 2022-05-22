import React, { useEffect ,useState} from 'react'
import '../axios'
import axios from 'axios'
import './App.css'
import Test from './Test'


export default function App() {
  const [state,setState] = useState([])
  useEffect(()=>{
    axios.get('/api/mmdb/movie/v3/list/hot.json?ct=%E5%8C%97%E4%BA%AC&ci=1&channelId=4').
    then(response=>{
      setState(response.data.data.hot)
    })
  },[])
  console.log(state)
  return (
    <div>
      <ul className='test'>
        {
          state.map((item)=>{
            return <li>{item.nm}</li>
          })
        }
      </ul>
      <Test />
    </div>
  )
}
