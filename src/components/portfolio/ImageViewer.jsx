import {useState} from 'react'
import Viewer from "react-viewer/dist/index";
import {CommerceMain, CommerceCart, CommerceCheckout, CommerceOrder, CommerceError, CommerceInfo} from './index';
import {DuvhaMain, DuvhaStats, DuvhaPrintout, DuvhaLogin, DuvhaInfo} from './index'
import { PimsMain, PimsLogin, PimsExe, PimsInfo } from './index';
import { ProlifixMain, ProlifixServices, ProlifixContact } from './index';
import { SignMain, SignSigned, SignPrint, SignInfo } from './index';
import { WeirMain, WeirHome, WeirInfo } from './index';

const ImageViewer = ({visible,setVisible, clicked}) => {
    var selected = '';
    if(clicked === 'commerce'){
        selected = [
            { src: CommerceInfo },
            { src: CommerceMain },
            { src: CommerceCart },
            { src: CommerceCheckout },
            { src: CommerceOrder },
            { src: CommerceError }
            
        ];
    }else if(clicked === 'duvha'){
        selected = [
            { src: DuvhaInfo },
            { src: DuvhaMain },
            { src: DuvhaStats },
            { src: DuvhaPrintout },
            { src: DuvhaLogin }
        ]
    }else if(clicked === 'pims'){
        selected = [
            { src: PimsInfo },
            { src: PimsMain },
            { src: PimsLogin },
            { src: PimsExe },
        ]
    }else if(clicked === 'prolifix'){
        selected = [
            { src:ProlifixMain},
            { src:ProlifixServices},
            { src:ProlifixContact}
        ]
    }else if(clicked === 'signature'){
        selected = [
            { src: SignInfo },
            { src: SignMain },
            { src: SignSigned },
            { src: SignPrint }
        ]
    }else if(clicked === 'weir'){
        selected = [
            { src: WeirInfo },
            { src: WeirMain },
            { src: WeirHome }
        ]
    }
    return (
        <div>
            <Viewer 
                visible={visible} 
                onClose={() => {
                    setVisible(false)
                }}
                images={selected}/>
        </div>
    )
}

export default ImageViewer