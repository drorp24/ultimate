import { keyframes } from '@emotion/react'

const bounce = keyframes` 
  0%  { transform: scale(1,1)      translateY(0); }
 10%  { transform: scale(1.3,.8)   translateY(0); }
 30%  { transform: scale(.8,1.3)   translateY(-0.4rem); }
        50%  { transform: scale(1.05,.95) translateY(0); }
 57%  { transform: scale(1,1)      translateY(-0.2rem); }
 64%  { transform: scale(1,1)      translateY(0); }
 100% { transform: scale(1,1)      translateY(0);
`
const moveUpNDown = {
  animation: `${bounce} 2.5s cubic-bezier(0.280, 0.840, 0.420, 1) 2s infinite`,
  position: 'absolute',
  left: '0',
  bottom: ' 0',
}

export default moveUpNDown
