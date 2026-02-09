import {motion} from "framer-motion";


type CardProps = {
  title: string;
  description: string;
}

export function Card({title, description}: CardProps) {
  return (<motion.div
    whileHover={{y: -4}}
    className="bg-white p-6 rounded-2xl shadow-sm"
  >
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-sm text-gray-500">
      {description}
    </p>
  </motion.div>)
}