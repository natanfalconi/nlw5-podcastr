import format from 'date-fns/format'
import ptBR from "date-fns/locale/pt-BR"

import styles from './styles.module.scss'

import Image from 'next/image'

import logo from '../../../public/logo.svg'

export function Header(){
    const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
        locale: ptBR
    })
    
    return(
        <header className={styles.headerContainer}>
            <Image src={logo} alt="Logo podcastr" />

            <p>O melhor para você ouvir, sempre</p>

            <span>{currentDate}</span>
        </header>
    )
}