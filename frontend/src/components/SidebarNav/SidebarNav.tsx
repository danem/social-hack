import { Sidebar, SidebarItem, SidebarBody, SidebarLabel, SidebarDivider, SidebarFooter, SidebarHeader } from "@components/catalyst/sidebar";
import React from "react";
import { Link } from 'react-router-dom';
import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import InboxStackIcon from '@heroicons/react/24/solid/InboxStackIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import BriefcaseIcon from '@heroicons/react/24/solid/BriefcaseIcon';
import DocumentIcon from '@heroicons/react/24/solid/DocumentIcon';
import Cog6ToothIcon from '@heroicons/react/24/solid/Cog6ToothIcon';

export function SidebarNav() {
    return (
        <Sidebar className="h-screen bg-white border-r border-gray-200 shadow">
            <SidebarBody>
                <SidebarHeader className="px-4 py-2">
                    <h1 className="text-lg font-bold">FairHaven</h1>
                </SidebarHeader>
                <SidebarItem>
                    <Link to="/" className="flex items-center">
                        <ChartBarIcon className="w-4 mr-2"/>
                        <SidebarLabel>Dashboard</SidebarLabel>
                    </Link>
                </SidebarItem>
                <SidebarItem>
                    <Link to="/pipeline" className="flex items-center">
                        <InboxStackIcon className="w-4 mr-2"/>
                        <SidebarLabel>Pipeline</SidebarLabel>
                    </Link>
                </SidebarItem>
                <SidebarItem>
                    <Link to="/contacts" className="flex items-center">
                        <UserIcon className="w-4 mr-2"/>
                        <SidebarLabel>Contacts</SidebarLabel>
                    </Link>
                </SidebarItem>
                <SidebarItem>
                    <Link to="/cases" className="flex items-center">
                        <BriefcaseIcon className="w-4 mr-2"/>
                        <SidebarLabel>Cases</SidebarLabel>
                    </Link>
                </SidebarItem>
                <SidebarItem>
                    <Link to="/documents" className="flex items-center">
                        <DocumentIcon className="w-4 mr-2"/>
                        <SidebarLabel>Documents</SidebarLabel>
                    </Link>
                </SidebarItem>
                <SidebarDivider />
                <SidebarItem>
                    <Link to="/settings" className="flex items-center">
                        <Cog6ToothIcon className="w-4 mr-2"/>
                        <SidebarLabel>Settings</SidebarLabel>
                    </Link>
                </SidebarItem>
            </SidebarBody>
            <SidebarFooter className="px-4 py-2">
                <p className="text-sm text-gray-600">© 2024 FairHaven</p>
            </SidebarFooter>
        </Sidebar>
    );
}