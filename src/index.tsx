import { DappPage } from './pages/DappPage'
import { SubPage1 } from './pages/SubPage1'
import { SubPage2 } from './pages/SubPage2'

const menuConfig = [
  {
    name: 'Dapp',
    page: DappPage,
    path: '/',
    children: [
      {
        name: 'Sub menu 1',
        page: SubPage1,
        path: '/sub-1'
      },
      {
        name: 'Sub menu 2',
        page: SubPage2,
        path: '/sub-2'
      }
    ]
  }
]

export { DappPage, SubPage1, SubPage2, menuConfig }
