import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export const Menu = ({
  menuConfig,
  className
}: {
  menuConfig: any
  className?: any
}) => {
  const location = useLocation()

  return <ul className={`menu ${className}`}>
    {
      menuConfig && menuConfig.map((item: any, key: number) => {
        let SubMenu = null
        if(item.children && item.children.length > 0) {
          SubMenu = <Menu menuConfig={item.children} className='sub-menu'/>
        }

        return <li className={`item ${location.pathname === item.path ? 'active' : '' }`} key={key}>
          {
            <Link to={item.path ? item.path : '#'}>
              <span>{item.name}</span>
            </Link>
          }

          {SubMenu ? SubMenu : ''}
        </li>
      })
    }
  </ul>
}
