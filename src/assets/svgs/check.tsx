import { FC } from "react";

export interface sizeable {
    size?: string;
    stroke?: string;
}

const CheckSVG: FC<sizeable> = ({size, stroke}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size ?? '32'} height={size ?? '32'} viewBox="0 0 512 512">
            <polyline points="352 176 217.6 336 160 272" style={{ fill: "none", stroke: stroke ?? '#fff', strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "32px" }} />
            <rect x="64" y="64" width="384" height="384" rx="48" ry="48" style={{ fill: "none", stroke: stroke ?? '#fff', strokeLinejoin: "round", strokeWidth: "32px" }} />
        </svg>

    )
}

export default CheckSVG;