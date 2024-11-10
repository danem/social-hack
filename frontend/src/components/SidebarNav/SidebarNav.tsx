import { Sidebar, SidebarItem, SidebarBody, SidebarLabel, SidebarDivider, SidebarFooter } from "@components/catalyst/sidebar";
import React from "react";
import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon'
import InboxStackIcon from '@heroicons/react/24/solid/InboxStackIcon'
import UserIcon from '@heroicons/react/24/solid/UserIcon'
import BriefcaseIcon from '@heroicons/react/24/solid/BriefcaseIcon'
import DocumentIcon from '@heroicons/react/24/solid/DocumentIcon'
import Cog6ToothIcon from '@heroicons/react/24/solid/Cog6ToothIcon'


export function SidebarNav () {
    return (
        <Sidebar className="h-screen">
            <SidebarBody>
                <SidebarItem><ChartBarIcon className="w-4"/><SidebarLabel>Dashboard</SidebarLabel></SidebarItem>
                <SidebarItem><InboxStackIcon className="w-4"/><SidebarLabel>Pipeline</SidebarLabel></SidebarItem>
                <SidebarItem><UserIcon className="w-4"/><SidebarLabel>Contacts</SidebarLabel></SidebarItem>
                <SidebarItem><BriefcaseIcon className="w-4"/><SidebarLabel>Cases</SidebarLabel></SidebarItem>
                <SidebarItem><DocumentIcon className="w-4"/><SidebarLabel>Documents</SidebarLabel></SidebarItem>
                <SidebarDivider/>
                <SidebarItem>
                    <Cog6ToothIcon className="w-4"/>
                    <SidebarLabel>Settings</SidebarLabel>
                </SidebarItem>
            </SidebarBody>
        </Sidebar>
    )
}
