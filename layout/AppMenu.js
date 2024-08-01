import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Admin',
            items: [

                { label: 'User Management', icon: 'pi pi-user', to: '/admin/adminCreateUser' },
                { label: 'Role Management', icon: 'pi pi-user', to: '/admin/rolemanagement' },
                { label: 'privilege Management', icon: 'pi pi-user', to: '/admin/privilegemanagement' },


            ]
        },
        {
            label: 'Files',
            items: [
                { label: 'Check In', icon: 'pi pi-fw pi-upload', to: '/home' },
                { label: 'My Drawings', icon: 'pi pi-fw pi-file-pdf', to: '/mydrawings' },
                { label: 'My Reviews', icon: 'pi pi-fw pi-user-edit', to: '/myreviews' },

            ]
        },
        {
            label: 'Drawings',
            items: [
                { label: 'New Drawing', icon: 'pi pi-fw pi-user-edit', to: '/newdrawing' },
                { label: 'My Drawings', icon: 'pi pi-fw pi-list', to: '/drawingtable' },

            ]
        },
        {
            label: 'Workflow Manager',
            items: [

                { label: 'Workflow Creation', icon: 'pi pi-cog', to: '/workflowCreation' },
                { label: 'Workflow Execution', icon: 'pi pi-fw pi-server', to: '/releaseC' },

            ]
        },

        {
            label: 'Review',
            items: [

                { label: 'Pending', icon: 'pi pi-fw pi-hourglass', to: '/reviewtableP' },
                { label: 'Completed', icon: 'pi pi-fw pi-check-circle', to: '/reviewtableC' },
                { label: 'Rejected', icon: 'pi pi-times-circle', to: '/reviewtableR' },

            ]
        },
        {
            label: 'Approve',
            items: [

                { label: 'Pending', icon: 'pi pi-fw pi-hourglass', to: '/approveP' },
                { label: 'Completed', icon: 'pi pi-fw pi-check-circle', to: '/approveC' },
                { label: 'Rejected', icon: 'pi pi-times-circle', to: '/approveR' },

            ]
        },
        {
            label: 'Release',
            items: [

                { label: 'Pending', icon: 'pi pi-fw pi-hourglass', to: '/releaseP' },
                { label: 'Completed', icon: 'pi pi-fw pi-check-circle', to: '/releaseC' },
                { label: 'Rejected', icon: 'pi pi-times-circle', to: '/releaseR' },

            ]
        },

        {
            label: 'UI Components',
            items: [
                { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
                { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
                { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', to: '/uikit/floatlabel' },
                { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', to: '/uikit/invalidstate' },
                { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button', class: 'rotated-icon' },
                { label: 'Table', icon: 'pi pi-fw pi-table', to: '/uikit/table' },
                { label: 'List', icon: 'pi pi-fw pi-list', to: '/uikit/list' },
                { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
                { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
                { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/uikit/overlay' },
                { label: 'Media', icon: 'pi pi-fw pi-image', to: '/uikit/media' },
                { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/uikit/menu', preventExact: true },
                { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
                { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file' },
                { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
                { label: 'Misc', icon: 'pi pi-fw pi-circle', to: '/uikit/misc' }
            ]
        },
        {
            label: 'Prime Blocks',
            items: [
                { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', to: '/blocks', badge: 'NEW' },
                { label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: 'https://blocks.primereact.org', target: '_blank' }
            ]
        },
        {
            label: 'Utilities',
            items: [
                { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', to: '/utilities/icons' },
                { label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: 'https://www.primefaces.org/primeflex/', target: '_blank' }
            ]
        },
        {
            label: 'Pages',
            icon: 'pi pi-fw pi-briefcase',
            to: '/pages',
            items: [
                {
                    label: 'Landing',
                    icon: 'pi pi-fw pi-globe',
                    to: '/landing'
                },
                {
                    label: 'Auth',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        {
                            label: 'Login',
                            icon: 'pi pi-fw pi-sign-in',
                            to: '/auth/login'
                        },
                        {
                            label: 'Error',
                            icon: 'pi pi-fw pi-times-circle',
                            to: '/auth/error'
                        },
                        {
                            label: 'Access Denied',
                            icon: 'pi pi-fw pi-lock',
                            to: '/auth/access'
                        }
                    ]
                },
                {
                    label: 'Crud',
                    icon: 'pi pi-fw pi-pencil',
                    to: '/pages/crud'
                },
                {
                    label: 'Timeline',
                    icon: 'pi pi-fw pi-calendar',
                    to: '/pages/timeline'
                },
                {
                    label: 'Not Found',
                    icon: 'pi pi-fw pi-exclamation-circle',
                    to: '/pages/notfound'
                },
                {
                    label: 'Empty',
                    icon: 'pi pi-fw pi-circle-off',
                    to: '/pages/empty'
                }
            ]
        },
        {
            label: 'Hierarchy',
            items: [
                {
                    label: 'Submenu 1',
                    icon: 'pi pi-fw pi-bookmark',
                    items: [
                        {
                            label: 'Submenu 1.1',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [
                                { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                            ]
                        },
                        {
                            label: 'Submenu 1.2',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                        }
                    ]
                },
                {
                    label: 'Submenu 2',
                    icon: 'pi pi-fw pi-bookmark',
                    items: [
                        {
                            label: 'Submenu 2.1',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [
                                { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
                            ]
                        },
                        {
                            label: 'Submenu 2.2',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
                        }
                    ]
                }
            ]
        },
        {
            label: 'Get Started',
            items: [
                {
                    label: 'Documentation',
                    icon: 'pi pi-fw pi-question',
                    to: '/documentation'
                },
                {
                    label: 'View Source',
                    icon: 'pi pi-fw pi-search',
                    url: 'https://github.com/primefaces/sakai-react',
                    target: '_blank'
                }
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}

                {/* <Link href="https://blocks.primereact.org" target="_blank" style={{ cursor: 'pointer' }}>
                    <img alt="Prime Blocks" className="w-full mt-3" src={`/layout/images/banner-primeblocks${layoutConfig.colorScheme === 'light' ? '' : '-dark'}.png`} />
                </Link> */}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
