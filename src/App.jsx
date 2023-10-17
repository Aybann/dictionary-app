import { useState, useRef, useEffect } from 'react'

function App() {
  const element = document.documentElement
  const api = "https://api.dictionaryapi.dev/api/v2/entries/en/"
  const [data, setData] = useState()
  const [isPending, setIsPending] = useState(null)
  const [error, setError] = useState(null)
  const [font, setFont] = useState('font-serif')
  const [isDark, setIsDark] = useState(false)
  const inputField = useRef()
  const checkField = useRef()

  useEffect(() => {
    if(isDark){
      element.classList.add('dark')
    } else {
      element.classList.remove('dark')
    }
  },[isDark])

  const handleSearch = (e) => {
    e.preventDefault();
    setIsPending(true)
    fetch(api + inputField.current.value )
    .then(res => {
     if(!res.ok){
       throw Error("Word is not found. try another words your check your spelling")
     }
     return res.json()
    }).then(data => {
      setIsPending(false)
      setError(null)
      setData(data[0])
    }).catch(error => {
      setIsPending(false)
      setError(error.message)
    })
  }

  const handleOptionChange = (value) => {
    setFont(value)
  }

  const handleToggleDark = () => {
    if(isDark){
      setIsDark(false)   
    } else {
      setIsDark(true)
    }
  }

  const handlePlay = () => {
    new Audio(data.phonetics[0].audio).play() 
  }

  return (
    <main className={`${font} min-h-screen dark:text-slate-200 dark:bg-slate-900`}>
      <div className='w-auto py-4 px-4 md:w-[600px] mx-auto md:py-10'>
        <div>
          <div className="flex items-center justify-between">
            <svg className="h-8 w-8 text-gray-400"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
            <div className='flex items-center'>
              <select id="countries" onChange={e => handleOptionChange(e.target.value)} className="bg-gray-50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mr-4 dark:text-slate-200 dark:bg-slate-800">
                <option defaultValue='font-serif' >Serif</option>
                <option value="font-sans">Sans</option>
                <option value="font-mono">Mono</option>
                <option value="font-thin">Thin</option>
              </select>
              <label className="relative inline-flex items-center cursor-pointer">
                <input ref={checkField} type="checkbox" onChange={handleToggleDark} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-900 dark:bg-slate-800"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  {
                    isDark 
                    ?<svg className="h-6 w-6 text-gray-400"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                    : <svg className="h-5 w-5 text-gray-400"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M16.2 4a9.03 9.03 0 1 0 3.9 12a6.5 6.5 0 1 1 -3.9 -12" /></svg>
                  }
                </span>
              </label>
            </div>
          </div>
          <div className="my-4">
            <form onSubmit={handleSearch}>
              <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                      </svg>
                  </div>
                  <input ref={inputField} on type="search" id="default-search" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:text-slate-200 dark:bg-slate-800" placeholder="Search words, Any words..." required />
                  <button type="submit"  className="text-white absolute right-2.5 bottom-2.5 bg-blue-900 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2  ">Search</button>
              </div>
            </form>
          </div>
        </div>
        <div>
          { isPending && <div>Loading...</div> }
          {
            error 
            ? <div> { error } </div>
            : <div>
                <div>
                {
                  data ?
                    data.meanings && data.meanings.map((means, index) => (
                    <div key={index}>
                      <div className='flex justify-between items-center'>
                        <div>
                          <p className='text-6xl mb-2 font-semibold'>{data.word}</p>
                          <p className='text-2xl text-blue-900 dark:text-blue-200'>{data.phonetic}</p>
                        </div>
                        <button onClick={handlePlay} className='w-fit h-fit p-4 rounded-full text-blue-900 bg-blue-200'>
                        <svg class="h-5 w-5 text-blue-600"  viewBox="0 0 24 24"  fill="currentColor"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <polygon points="5 3 19 12 5 21 5 3" /></svg>
                        </button>
                      </div>
                      <p className='text-xl my-4 font-semibold '>{means.partOfSpeech}</p>
                      <hr />
                      <p className='text-xl text-gray-500 dark:text-slate-400'>Meaning</p>
                      <ul className='list-disc list-outside px-8 py-2'>
                        {
                          means.definitions && means.definitions.map((def, index) => (
                            <li key={index}>{def.definition}</li>
                          ))
                        }
                      </ul>
                      { means.synonyms && means.synonyms.length !== 0 ? 
                      <div>
                        <p className='text-xl my-4 text-gray-500 dark:text-slate-400'>Synonyms</p>
                        <ul className='flex gap-2 flex-wrap px-8 py-2'>
                          {
                            means.synonyms && means.synonyms.map((syn, index) => (
                              <li key={index} className='font-semibold text-blue-900 dark:text-slate-200'>{syn}</li>
                            ))
                          }
                        </ul>   
                      </div>
                      : <div></div>
                      }

                      { means.antonyms && means.antonyms.length !== 0 ? 
                      <div>
                        <p className='text-xl my-4 text-gray-500 dark:text-slate-400'>Antonyms</p>
                        <ul className='flex gap-2 flex-wrap px-8 py-2'>
                          {
                            means.antonyms.map((ant, index) => (
                              <li key={index} className='font-semibold text-blue-900 dark:text-slate-200'>{ant}</li>
                            ))
                          }
                        </ul> 
                      </div>
                      : <div></div>
                      }
                      <div className='my-6 text-xs'>
                        <hr />
                        <p  className='mt-4' ><span className='text-gray-400 mr-4'>Source</span> <a href={data.sourceUrls} className='underline'>{data.sourceUrls}</a></p>
                      </div>
                    </div>
                    ))
                  : <div className='flex justify-center items-center h-[100px]'>No Data</div>
                }
                </div>
              </div>
          }
        </div>
      </div>
    </main>
  )
}

export default App
