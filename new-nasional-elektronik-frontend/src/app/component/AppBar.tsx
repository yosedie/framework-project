import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image';
import logoWhite from '../public/logo_white.png'

import type { RootState } from '../util/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../util/redux/Features/user/userSlice';
import { increment, decrement, incrementByAmount } from '../util/redux/Features/counter/counterSlice';


const pages = ['Products', 'Events'];
const pagesAdmin = ['Dashboard', 'Products', 'Transaction', 'Manage User', 'Manage Event', 'Confirm Address'];
const pagesPenjual = ['Dashboard', 'Products', 'Transaction'];
const settings = ['Profile', 'Transaction History', 'Logout'];
const settingsAdmin = ['Profile', 'Logout'];
const settingsGuest = ['Login', 'Register'];

function ResponsiveAppBar() {
    const account = useSelector((state: RootState) => state.user.jwt_token)
    const role = useSelector((state: RootState) => state.user.role)
    const profilePictureRedux = useSelector((state: RootState) => state.user.userData.picture_profile)
    const dispatch = useDispatch()
    const router = useRouter()

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleRoute = (paramPage: String) => {
        router.push(`/${paramPage}`)
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleUserMenu = (page: string) => {
      if(typeof page === 'string') {
        const pageString = page.toLowerCase()
        if(pageString == "transactionhistory") {
          handleRoute("transaction")
        } else {
          handleRoute(pageString)
        }
      }
    };

    return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
        <Image
            draggable={false}
            src={logoWhite}
            alt="Example"
            width={75}
            height={50}
            onClick={() => router.push("/")}
            style={{
                cursor: "pointer"
            }}
        />
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography> */}

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {
              (role === "admin"
                ? pagesAdmin
                : role === "penjual"
                  ? pagesPenjual
                  : pages)
                .map((page) => (
                  <MenuItem key={page} onClick={() => handleRoute(page)}>
                    <Typography sx={{ textAlign: 'center'}}>{page}</Typography>
                  </MenuItem>
                ))
              }
            </Menu>
          </Box>
          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
          {/* <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography> */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {(role === "admin"
              ? pagesAdmin
              : role === "penjual"
                ? pagesPenjual
                : pages)
              .map((page) => (
              <Button
                key={page}
                onClick={() => handleRoute(page.toLowerCase().replace(/\s+/g, ''))}
                sx={{ my: 2, color: usePathname() === ("/" + page.toLowerCase().replace(/\s+/g, '')) ? 'yellow' : 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar src={profilePictureRedux || ""} />
              </IconButton>
            </Tooltip>
            {
              role === "user" && (
                <Tooltip title="Open shopping cart">
                  <IconButton onClick={() => router.push("/shoppingcart")} sx={{ p: 0 }}>
                    <ShoppingCartIcon sx={{color: "white", ml: 2}} />
                  </IconButton>
                </Tooltip>
              )
            }
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={() => setAnchorElUser(null)}
            >
              {
              (account !== ""
                ? role === "user"
                  ? settings
                  : settingsAdmin
                : settingsGuest)
                  .map((setting) => (
                    <MenuItem key={setting} onClick={() => {
                      if(setting === "Logout") {
                        sessionStorage.setItem('user', "");
                        dispatch(logout({}))
                        handleRoute("login")
                      } else {
                        handleUserMenu(setting.replace(/\s+/g, ''))
                      }
                      setAnchorElUser(null);
                    }}>
                      <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                    </MenuItem>
                  ))
              }
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;