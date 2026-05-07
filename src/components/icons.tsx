'use client'

import React from 'react'

type IconProps = { size?: number; className?: string; style?: React.CSSProperties; color?: string }

const _svg = (paths: any[], s: number, cls: string, st?: React.CSSProperties) => React.createElement('svg', { xmlns:'http://www.w3.org/2000/svg', width:s||24, height:s||24, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:'2', strokeLinecap:'round', strokeLinejoin:'round', className:cls||'', style:st }, ...paths.map((p: any,i: number) => React.createElement(p[0], { key:i, ...p[1] })));

export const Search=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['circle',{cx:'11',cy:'11',r:'8'}],['path',{d:'m21 21-4.35-4.35'}]],s,c,st);
export const Map=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['polygon',{points:'1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6'}],['line',{x1:'8',y1:'2',x2:'8',y2:'18'}],['line',{x1:'16',y1:'6',x2:'16',y2:'22'}]],s,c,st);
export const CheckSquare=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['polyline',{points:'9 11 12 14 22 4'}],['path',{d:'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'}]],s,c,st);
export const FileText=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['path',{d:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'}],['polyline',{points:'14 2 14 8 20 8'}],['line',{x1:'16',y1:'13',x2:'8',y2:'13'}],['line',{x1:'16',y1:'17',x2:'8',y2:'17'}]],s,c,st);
export const ChevronRight=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['polyline',{points:'9 18 15 12 9 6'}]],s,c,st);
export const ChevronLeft=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['polyline',{points:'15 18 9 12 15 6'}]],s,c,st);
export const ChevronDown=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['polyline',{points:'6 9 12 15 18 9'}]],s,c,st);
export const ArrowRight=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['line',{x1:'5',y1:'12',x2:'19',y2:'12'}],['polyline',{points:'12 5 19 12 12 19'}]],s,c,st);
export const Check=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['polyline',{points:'20 6 9 17 4 12'}]],s,c,st);
export const CheckCircle=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['path',{d:'M22 11.08V12a10 10 0 1 1-5.93-9.14'}],['polyline',{points:'22 4 12 14.01 9 11.01'}]],s,c,st);
export const Menu=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['line',{x1:'3',y1:'12',x2:'21',y2:'12'}],['line',{x1:'3',y1:'6',x2:'21',y2:'6'}],['line',{x1:'3',y1:'18',x2:'21',y2:'18'}]],s,c,st);
export const X=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['line',{x1:'18',y1:'6',x2:'6',y2:'18'}],['line',{x1:'6',y1:'6',x2:'18',y2:'18'}]],s,c,st);
export const Plus=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['line',{x1:'12',y1:'5',x2:'12',y2:'19'}],['line',{x1:'5',y1:'12',x2:'19',y2:'12'}]],s,c,st);
export const Minus=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['line',{x1:'5',y1:'12',x2:'19',y2:'12'}]],s,c,st);
export const Building=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['rect',{x:'4',y:'2',width:'16',height:'20',rx:'2',ry:'2'}],['path',{d:'M9 22v-4h6v4M8 7h.01M16 7h.01M12 7h.01M12 11h.01M12 15h.01M16 11h.01M16 15h.01M8 11h.01M8 15h.01'}]],s,c,st);
export const Target=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['circle',{cx:'12',cy:'12',r:'10'}],['circle',{cx:'12',cy:'12',r:'6'}],['circle',{cx:'12',cy:'12',r:'2'}]],s,c,st);
export const Rocket=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['path',{d:'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z'}],['path',{d:'m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z'}],['path',{d:'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5'}]],s,c,st);
export const Award=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['circle',{cx:'12',cy:'8',r:'7'}],['polyline',{points:'8.21 13.89 7 23 12 20 17 23 15.79 13.88'}]],s,c,st);
export const Sparkles=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['path',{d:'m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z'}],['path',{d:'M5 3v4M19 17v4M3 5h4M17 19h4'}]],s,c,st);
export const AlertCircle=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['circle',{cx:'12',cy:'12',r:'10'}],['line',{x1:'12',y1:'8',x2:'12',y2:'12'}],['line',{x1:'12',y1:'16',x2:'12.01',y2:'16'}]],s,c,st);
export const Upload=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['path',{d:'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'}],['polyline',{points:'17 8 12 3 7 8'}],['line',{x1:'12',y1:'3',x2:'12',y2:'15'}]],s,c,st);
export const Folder=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['path',{d:'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'}]],s,c,st);
export const Trash2=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['polyline',{points:'3 6 5 6 21 6'}],['path',{d:'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'}],['line',{x1:'10',y1:'11',x2:'10',y2:'17'}],['line',{x1:'14',y1:'11',x2:'14',y2:'17'}]],s,c,st);
export const Download=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['path',{d:'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'}],['polyline',{points:'7 10 12 15 17 10'}],['line',{x1:'12',y1:'15',x2:'12',y2:'3'}]],s,c,st);
export const Clock=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['circle',{cx:'12',cy:'12',r:'10'}],['polyline',{points:'12 6 12 12 16 14'}]],s,c,st);
export const BarChart2=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['line',{x1:'18',y1:'20',x2:'18',y2:'10'}],['line',{x1:'12',y1:'20',x2:'12',y2:'4'}],['line',{x1:'6',y1:'20',x2:'6',y2:'14'}]],s,c,st);
export const Loader2=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['path',{d:'M21 12a9 9 0 1 1-6.219-8.56'}]],s,c,st);
export const Shield=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['path',{d:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'}]],s,c,st);
export const TrendingUp=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['polyline',{points:'23 6 13.5 15.5 8.5 10.5 1 18'}],['polyline',{points:'17 6 23 6 23 12'}]],s,c,st);
export const BookOpen=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['path',{d:'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'}],['path',{d:'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'}]],s,c,st);
export const LogOut=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['path',{d:'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'}],['polyline',{points:'16 17 21 12 16 7'}],['line',{x1:'21',y1:'12',x2:'9',y2:'12'}]],s,c,st);
export const Mail=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['path',{d:'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'}],['polyline',{points:'22,6 12,13 2,6'}]],s,c,st);
export const Lock=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['rect',{x:'3',y:'11',width:'18',height:'11',rx:'2',ry:'2'}],['path',{d:'M7 11V7a5 5 0 0 1 10 0v4'}]],s,c,st);
export const User=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['path',{d:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'}],['circle',{cx:'12',cy:'7',r:'4'}]],s,c,st);
export const Eye=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['path',{d:'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'}],['circle',{cx:'12',cy:'12',r:'3'}]],s,c,st);
export const EyeOff=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['path',{d:'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94'}],['path',{d:'M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19'}],['path',{d:'m1 1 22 22'}],['path',{d:'M14.12 14.12a3 3 0 1 1-4.24-4.24'}]],s,c,st);
export const Settings=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['circle',{cx:'12',cy:'12',r:'3'}],['path',{d:'M12 1v2m0 18v2m-9-11h2m18 0h2m-4.22-5.78 1.42-1.42m-15.56 0 1.42 1.42m0 11.32-1.42 1.42m15.56 0-1.42-1.42'}]],s,c,st);
export const Pencil=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['path',{d:'M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z'}],['path',{d:'m15 5 4 4'}]],s,c,st);
export const Save=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['path',{d:'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z'}],['polyline',{points:'17 21 17 13 7 13 7 21'}],['polyline',{points:'7 3 7 8 15 8'}]],s,c,st);
export const MessageCircle=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['path',{d:'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z'}]],s,c,st);
export const Send=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['line',{x1:'22',y1:'2',x2:'11',y2:'13'}],['polygon',{points:'22 2 15 22 11 13 2 9 22 2'}]],s,c,st);
export const Users2=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['path',{d:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'}],['circle',{cx:'9',cy:'7',r:'4'}],['path',{d:'M22 21v-2a4 4 0 0 0-3-3.87'}],['path',{d:'M16 3.13a4 4 0 0 1 0 7.75'}]],s,c,st);
export const ExternalLink=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['path',{d:'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'}],['polyline',{points:'15 3 21 3 21 9'}],['line',{x1:'10',y1:'14',x2:'21',y2:'3'}]],s,c,st);
export const Gauge=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['path',{d:'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z'}],['path',{d:'m14.7 10.3-3.7 3.7'}],['circle',{cx:'12',cy:'12',r:'1'}]],s,c,st);
export const CalendarCheck=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['rect',{x:'3',y:'4',width:'18',height:'18',rx:'2',ry:'2'}],['line',{x1:'16',y1:'2',x2:'16',y2:'6'}],['line',{x1:'8',y1:'2',x2:'8',y2:'6'}],['line',{x1:'3',y1:'10',x2:'21',y2:'10'}],['polyline',{points:'9 16 11 18 15 14'}]],s,c,st);
export const Briefcase=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['rect',{x:'2',y:'7',width:'20',height:'14',rx:'2',ry:'2'}],['path',{d:'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'}]],s,c,st);
export const Lightbulb=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['path',{d:'M9 18h6'}],['path',{d:'M10 22h4'}],['path',{d:'M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14'}]],s,c,st);
export const Coins=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['circle',{cx:'8',cy:'8',r:'6'}],['path',{d:'M18.09 10.37A6 6 0 1 1 10.34 18'}],['path',{d:'M7 6h1v4'}],['path',{d:'m16.71 13.88.7.71-2.82 2.82'}]],s,c,st);
export const Scale=({size:s=24,className:c='',style:st}:IconProps)=>_svg([['path',{d:'m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'}],['path',{d:'m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'}],['path',{d:'M7 21h10'}],['path',{d:'M12 3v18'}],['path',{d:'M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'}]],s,c,st);
