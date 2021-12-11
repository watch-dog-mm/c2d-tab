import React from "react";
import useOnClickOutside from "../../hooks/useClickOutSide";
import Portal from '../portal'
import "./index.css";

type SelectType={
    label?:string
    options:{label:string,value:any}[]
    placeholder?:string
    selectedOption?:{label:string,value:any}
    onMenuItemClick?:(option:{label:string,value:any},options:{label:string,value:any}[],index:number)=>void
}

const Select:React.FC<SelectType> = ({label,options,placeholder,selectedOption,onMenuItemClick}) => {
  const menuRef=React.useRef(null)
  const listRef= React.useRef(null)
  const [coords, setCoords] = React.useState({left:0,top:0,width:0}); // takes current button coordinates
  const [isOn, setOn] = React.useState(false);
  const [selectedItem,setSelectedItem]= React.useState(selectedOption)
  useOnClickOutside(listRef,()=>{setOn(false)})
  React.useEffect(()=>{
    setSelectedItem(selectedOption)
  },[selectedOption])

  return (
    <>
    {/* @ts-ignore */}
    
    <div  className="menu-label">
        <label >{label||'Your Label Here'}</label>
    </div>
      <div ref={menuRef}   className="menu" style={{width:'100px'}} onClick={(e:React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
          if(menuRef && menuRef.current){
            
            const rect = e.currentTarget.getBoundingClientRect();
            const menu = menuRef.current as HTMLDivElement
            console.log(menu.clientWidth)
            setCoords({
              left: rect.x,
              top: rect.y + window.scrollY+30,
              width:menu.clientWidth
            });
            setOn((prev)=>!prev)
          }
      }}>{!selectedItem?placeholder||'Select Menu':selectedItem.label}</div>
      <Portal>
        {isOn && <ul className="menulist" ref={listRef}   style={{position:'absolute',top:coords?.top,left:coords?.left,width:coords?.width}}>
            {options.map((item,index)=><li className="menu-item"  onClick={()=>{onMenuItemClick?.(item,options,index)
            setSelectedItem(item)
            setOn(false)
            }} key={`${item.label}-${item.value}`}>{item.label}</li>)}
        </ul>}
      </Portal>
      
    </>
  )
}

export default Select;
