import './App.css';
// import data from './data.json'
// import * as API from './api/people'
import { getCharacter, getPeople, searchCaracter } from './api/people';
import { useState, useEffect, useRef } from 'react';
function App() {
  const inputSearch = useRef(null)
  const [people, setPeople] = useState([])
  const [currentCharacter, setCurrentCharacter] = useState(1)
  const [detail, setDetail] = useState({})
  const [textSearch, settextSearch] = useState('')
  const [page, setPage] = useState(1)
  const [errorState, setErrorState] = useState({ hasError: false })
  useEffect(() => {
    getPeople(page)
    .then(setPeople)
    .catch(handleError)
  }, [page])

  useEffect(() => {
    getCharacter(currentCharacter).then(setDetail).catch(handleError)
  }, [currentCharacter])

  const handleError = (error) => {
    setErrorState({ hasError: true, message: error.message })
  }
  const showDetail = (character) => {
    const id = Number(character.url.split('/').slice(-2)[0])
    setCurrentCharacter(id)
  }
  const onChangeTextSearch = (event) => {
    event.preventDefault()
    const text = inputSearch.current.value
    settextSearch(text)

  }
  const onSearchSubmit = (event) => {
    if (event.key !== 'Enter') return;
    inputSearch.current.value = ''
    setDetail({})

    searchCaracter(textSearch)
    .then(setPeople)
    .catch(handleError)


  }
  const onChangePage = (next)=>{
    if(!people.previous && page + next <=0 )return
    if(!people.next && page + next >=9 )return

    setPage(page+next)
  }
  return (
    <div>
      <input
        ref={inputSearch}
        onChange={onChangeTextSearch}
        onKeyUp={onSearchSubmit}
        type="text" placeholder='Busca un personaje' />
      <ul>
        {errorState.hasError && <div>{errorState.message}</div>}
        {people?.results?.map(character => (
          <li key={character.name} onClick={() => showDetail(character)}>
            {character.name}
          </li>)
        )}
      </ul>
      <section>
        <button onClick={()=>onChangePage(-1)}>Prev</button>| {page} |<button onClick={()=>onChangePage(+1)}>Next</button>

      </section>
      {detail &&
        <aside >
          <h1>{detail.name}</h1>
          <ul>
            <li>Heigth: {detail.height}</li>
            <li>Mass: {detail.mass}</li>
            <li>Year of Birth: {detail.birth_year}</li>

          </ul>

        </aside>
      }
    </div>

  );
}

export default App;
