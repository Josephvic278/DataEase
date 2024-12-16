import { Outlet, Link } from 'react-router-dom'
import Navbar from './Navbar'
// import Footer from './Footer'

const Layout = () => {
	return (
		<section className="bg-grid">
			<div className="max-w-[75rem] mx-auto">
	        <Navbar />
		        <div className="max-w-9xl mx-auto ">
		          <Outlet />
		        </div>
	        {/* <Footer /> */}
      	</div>
		</section>
	)
}

export default Layout