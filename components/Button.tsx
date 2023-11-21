import React from 'react'

type Props = {
    isLoading: boolean
}

 const Button = (props: Props) => {

    if(props.isLoading == true)
        return <span>Carregando...</span>

  return (
    <button {...props} >
        Pesquisar
    </button>
  )
}

export default Button