
'use client';

import React from 'react';
import type { TeamMember, SocialLink } from '@/lib/types';

interface TeamMemberBadgeProps {
  member: TeamMember;
}

const iconMap: Record<string, string> = {
  chat: '💬',
  website: '🌐',
  linkedin: '🔗',
  github: '💻',
};


export function TeamMemberBadge({ member }: TeamMemberBadgeProps) {
  const socialIcons = member.socials || [];
  
  return (
    <>
      <style>{`
        .team-badge {
            position: relative; 
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
            border-radius: 1rem;
            overflow: visible; 
            box-shadow: 0 4px 10px rgba(100, 108, 255, 0.15);
        }

        .team-badge:hover {
            transform: translateY(-8px); 
            box-shadow: 0 18px 40px rgba(126, 34, 206, 0.28); 
        }

        .profile-image {
            position: relative;
            width: 140px; 
            height: 140px;
            border-radius: 50%;
            overflow: hidden;
            border: 3px solid #f0f0f0; 
            transition: box-shadow 0.3s ease-in-out;
        }

        .team-badge:hover .profile-image {
            box-shadow: 0 0 0 4px #8b5cf6, 0 0 0 8px rgba(139, 92, 246, 0.3);
        }

        .icon-container {
            position: absolute;
            top: -30px; 
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 8px; 
            opacity: 0; 
            transition: opacity 0.3s ease-out, transform 0.3s ease-out;
            pointer-events: none; 
        }

        .team-badge:hover .icon-container {
            opacity: 1; 
            transform: translateX(-50%) translateY(-10px); 
            pointer-events: all; 
        }

        .icon-overlay {
            width: 38px; 
            height: 38px;
            border-radius: 50%;
            background-color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 18px; 
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25); 
            transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
            cursor: pointer;
            text-decoration: none;
        }

        .icon-overlay:hover {
            transform: translateY(-3px) scale(1.1); 
            background-color: #fce7f3;
        }

        .description-area {
            max-height: 0;
            opacity: 0;
            margin-top: 0;
            padding-top: 0;
            line-height: 1.4;
            text-align: center;
            color: #4b5563;
            transition: max-height 0.5s ease-in-out, opacity 0.5s ease-in-out, margin 0.5s ease-in-out;
        }

        .team-badge:hover .description-area {
            max-height: 100px;
            opacity: 1;
            margin-top: 0.75rem;
            padding-top: 0.75rem;
            border-top: 1px solid #f3e8ff;
        }
        
        .member-name {
            font-family: 'Roboto Slab', serif; 
            text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
        }
        
        .team-badge:hover .member-name {
            color: #4c1d95;
            letter-spacing: 0.5px;
            transform: scale(1.03);
        }

        .member-title {
            color: #8b5cf6;
            text-transform: uppercase; 
            letter-spacing: 2px;
            font-weight: 500;
            transition: all 0.3s ease;
            font-size: 0.85rem;
        }
        
        .team-badge:hover .member-title {
            color: #a78bfa;
            transform: translateY(2px);
        }
      `}</style>
      <div className="team-badge bg-white shadow-xl p-6 w-72 flex flex-col items-center">
        
        <div className="icon-container">
            {socialIcons.map((social) => (
                 <a 
                    key={social.name} 
                    href={social.href} 
                    className="icon-overlay" 
                    title={social.name}
                    target="_blank"
                    rel="noopener noreferrer"
                 >
                    {iconMap[social.name.toLowerCase()] || '🔗'}
                </a>
            ))}
        </div>

        <div className="profile-image mb-4">
            <img 
                src={member.photo} 
                alt={`${member.name} Profile`}
            />
        </div>

        <div className="text-content text-center">
            <div className="text-xl font-semibold text-gray-800 mb-1 member-name">{member.name}</div>
            <div className="text-base font-normal member-title">{member.position}</div>
        </div>
        
        <div className="description-area text-sm">
            {member.bio}
        </div>
    </div>
    </>
  );
}
