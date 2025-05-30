import { useState, useEffect } from 'react'


const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState((localStorage.getItem('dark') ? JSON.parse(localStorage.getItem('dark')) : false))

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (darkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }


  }, [darkMode])

  const handleDarkMode = () => {
  	setDarkMode(!darkMode)
  	localStorage.setItem('dark', JSON.stringify(!darkMode))
  }

	return (
		<>
			<i className={darkMode ? 'pi pi-sun i' : 'pi pi-moon i'} id="darkLight" onClick={handleDarkMode}></i>
		</>
	)
}

export default DarkModeToggle