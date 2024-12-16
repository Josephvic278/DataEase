import React from 'react'
import img1 from '../../assets/mtn.svg'
import img2 from '../../assets/glo.svg'
import img3 from '../../assets/airtel.svg'
import img4 from '../../assets/9mobile.svg'

const img_style = 'w-14'
const mtn_width = 'w-24'
const AfterHero = () => {
	return (
        <section className='z-40 h-max'>
            <div className='bg-green-500 lg:rounded-lg -mt-7 w-full'>
                <div className='justify-center items-center flex h-32'>
                <div className='sm:justify-evenly justify-between items-center w-98 h-28 sm:border-2 border-white rounded-lg flex'> 
                    <div>
                        <img src={img1} alt="" className={mtn_width} />
                    </div>
                    <div>
                    <img src={img2} alt="" className={img_style} />
                    </div>
                    <div>
                    <img src={img3} alt="" className={img_style} />
                    </div>
                    <div>
                    <img src={img4} alt="" className={img_style} />
                    </div>
                </div>
                </div>
            </div>
        </section>
	)
}

export default  AfterHero 