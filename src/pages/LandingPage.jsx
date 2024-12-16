import React from 'react'
import { createAuthAxios } from '@/api/authAxios';
import authAxios from '@/api/authAxios';
// import { Hero, AfterHero} from '../components/index'

import { Hero, AfterHero, Plans,FooterBase, DefaultAccordion, Service, AboutUs} from '../components'
const LandingPage = () => {
	const authAxios = createAuthAxios()
	return (
		<div className="overflow-hidden">
			<Hero />
			<AfterHero />
			<Service/>
			{/* <Plans/> */}
			<DefaultAccordion/>
			{/* <DefaultAccordion/> */}
			<AboutUs/>
			<FooterBase/>
		</div>
	)
}

export default LandingPage
