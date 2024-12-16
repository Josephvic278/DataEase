import React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import 'boxicons/css/boxicons.min.css'; // Importing Boxicons CSS

export function DefaultAccordion() {
  const [open, setOpen] = React.useState(1);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  return (
    <>
    <div>
      <h1 className="text-center text-3xl mb-8 font-medium">Our service quality</h1>
    </div>
      <Accordion open={open === 1} className="border rounded-lg shadow-md mb-4">
        <AccordionHeader
          className="flex items-center justify-between text-lg font-medium bg-green-50 p-4 hover:bg-green-100 h-20"
          onClick={() => handleOpen(1)}
        >
          <div className="flex items-center">
            <i className='bx bx-question-mark text-vibrantGreen text-2xl'></i>
            <span className="ml-2">Charge free funding</span>
          </div>
          {/* <i className={`bx bx-chevron-down text-vibrantGreen text-2xl transition-transform duration-300 ${open === 1 ? "rotate-180" : ""}`}></i> */}
        </AccordionHeader>
        <AccordionBody className="p-8 bg-white">
        We offer fast, free, and reliable account funding, ensuring your transactions are processed quickly and efficiently with no delays or extra charges.
        </AccordionBody>
      </Accordion>

      <Accordion open={open === 2} className="border rounded-lg shadow-md mb-4">
        <AccordionHeader
          className="flex items-center justify-between text-lg font-medium bg-green-50 p-4 hover:bg-green-100 h-20"
          onClick={() => handleOpen(2)}
        >
          <div className="flex items-center">
            <i className='bx bx-book text-vibrantGreen text-2xl'></i>
            <span className="ml-2">We are 100% reliable</span>
          </div>
          {/* <i className={`bx bx-chevron-down text-vibrantGreen text-2xl transition-transform duration-300 ${open === 2 ? "rotate-180" : ""}`}></i> */}
        </AccordionHeader>
        <AccordionBody className="p-8 bg-white">
        We pride ourselves on being 100% reliable, delivering consistent, dependable services you can trust. Our commitment to excellence ensures that we meet your needs efficiently, every time. With a proven track record of reliability, you can count on us to provide seamless solutions, no matter the situation.
        </AccordionBody>
      </Accordion>

      <Accordion open={open === 3} className="border rounded-lg shadow-md mb-4">
        <AccordionHeader
          className="flex items-center justify-between text-lg font-medium bg-green-50 p-4 hover:bg-green-100 h-20"
          onClick={() => handleOpen(3)}
        >
          <div className="flex items-center">
            <i className='bx bx-bulb text-vibrantGreen text-2xl'></i>
            <span className="ml-2">We are automated</span>
          </div>
          {/* <i className={`bx bx-chevron-down text-vibrantGreen text-2xl transition-transform duration-300 ${open === 3 ? "rotate-180" : ""}`}></i> */}
        </AccordionHeader>
        <AccordionBody className="p-8 bg-white">
        Our platform is fully automated, providing fast, seamless account funding and purchases. Every transaction is instant and hassle-free, ensuring smooth operations from start to finish.
        </AccordionBody>
      </Accordion>
    </>
  );
}
