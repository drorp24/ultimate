import { useMemo } from 'react'
import { keyProxy } from '../utility/proxies'

import PersonIcon from '@material-ui/icons/PermIdentityOutlined'
import PlaceIcon from '@material-ui/icons/PlaceOutlined'
import TimeIcon from '@material-ui/icons/AccessTimeOutlined'
import DeviceIcon from '@material-ui/icons/PhoneOutlined'
import NotListedIcon from '@material-ui/icons/HelpOutlined'

export const useColor = relationType =>
  useMemo(() => entityTypes[relationTypes[relationType].entity].color, [
    relationType,
  ])

export const relationTypes = keyProxy({
  son: {
    entity: 'PERSON',
  },
  brother: {
    entity: 'PERSON',
  },
  girlfriend: {
    entity: 'PERSON',
  },
  in: {
    entity: 'LOCATION',
  },
  near: {
    entity: 'LOCATION',
  },
  uses: {
    entity: 'LOCATION',
  },
  UNDEFINED: {
    entity: 'UNDEFINED',
  },
})

const entityTypes = keyProxy({
  PERSON: {
    name: 'PERSON',
    mutability: 'IMMUTABLE',
    icon: <PersonIcon />,
    selector: true,
    color: 'orange',
  },
  LOCATION: {
    name: 'LOCATION',
    mutability: 'IMMUTABLE',
    icon: <PlaceIcon />,
    selector: true,
    color: 'deepskyblue',
  },
  TIME: {
    name: 'TIME',
    mutability: 'IMMUTABLE',
    icon: <TimeIcon />,
    selector: false,
    color: 'aquamarine',
  },
  DEVICE: {
    name: 'DEVICE',
    mutability: 'IMMUTABLE',
    icon: <DeviceIcon />,
    selector: true,
    color: 'coral',
  },
  MENTION: {
    name: 'MENTION',
    mutability: 'IMMUTABLE',
    selector: false,
    color: 'lightgreen',
  },
  HASHTAG: {
    name: 'HASHTAG',
    mutability: 'IMMUTABLE',
    selector: false,
    color: 'pink',
  },
  UNDEFINED: {
    name: 'Not listed',
    mutability: 'IMMUTABLE',
    icon: <NotListedIcon />,
    selector: false,
    color: 'rgba(0, 0, 0, 0.5)',
  },
})

export const entityStyle = ({ type, role }) => ({
  backgroundColor: role === 'text' ? entityTypes[type].color : 'none',
  border: role === 'text' ? 'none' : `1px solid ${entityTypes[type].color}`,
  borderRadius: '1rem',
  display: 'inline-flex',
  justifyContent: 'center',
  padding: '0.1rem 0.5rem',
  alignItems: 'center',
  lineHeight: '1',
  ...(role === 'text' && {
    transform: `translateY(${entityTypes[type].icon ? '0.4rem' : '0'}`,
  }),
  whiteSpace: 'nowrap',
})
export const entityIconStyle = ({ type, role }) => ({
  display: 'inline-flex',
  marginRight: '0.25rem',
  fontSize: '1rem',
  color: role === 'text' ? 'rgba(0, 0, 0, 0.6)' : entityTypes[type].color,
})

export default entityTypes
