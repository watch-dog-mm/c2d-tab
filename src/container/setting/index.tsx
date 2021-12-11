import React, { useCallback, useMemo } from "react";
import "./index.css";
import Select from "../../component/select";
import Card from "../../component/card";
import Switch from "../../component/switch";
import Button from "../../component/button";
import { setStorage, getStorage } from "../../utils/storage";
import useStorage from "../../hooks/useStorage";
import {STORAGE_KEY} from '../../constants'

const TIME_INTERVALS = [
  { label: "5 minutes", value: 300000 },
  { label: "30 minutes", value: 1.8e6 },
  { label: "1 Hour", value: 3.6e6 },
  { label: "3 Hour", value: 1.08e7 },
];
const MINIMUM_Tabs = [
  { label: "3 Tabs", value: 3 },
  { label: "4 Tabs", value: 4 },
  { label: "5 Tabs", value: 5 },
  { label: "6 Tabs", value: 6 },
];
const Setting = () => {
 const interval = useStorage(STORAGE_KEY.C2D_INTERVAL)
 const numberOfTabs = useStorage(STORAGE_KEY.C2D_TAB)
 const autoStart = useStorage(STORAGE_KEY.C2D_AUTO_START)
 
 
  return (
    <>
      <div>
        <a className="title setting-title">C2D Tab extension Settings</a>
        <Button>Start Supporting</Button>
        <div>
          <div className="divider divider-horizontal"></div>
        </div>

        <div className="container horizontal">
          <div className="container vertical flex-grow">
            <div>
              <Select
                options={TIME_INTERVALS}
                selectedOption={
                  interval
                    ? interval
                    : { label: "30 minutes", value: 1.8e6 }
                }
                label="Tabs Show up Interval"
                onMenuItemClick={(option) => {
                  setStorage(STORAGE_KEY.C2D_INTERVAL, option);
                }}
              />
            </div>
            <div>
              <Select
                options={MINIMUM_Tabs}
                selectedOption={numberOfTabs?numberOfTabs:{ label: "4 Tabs", value: 4 }}
                label="Minimum Tabs to Show"
                onMenuItemClick={(option) => {
                  setStorage(STORAGE_KEY.C2D_TAB, option);
                }}
              />
            </div>
          </div>
          <div>
            <div className="divider divider-vertical"></div>
          </div>
          <div className="container vertical flex-grow">
            <div>
              <Switch label="Start with Browser" onChange={(val)=>setStorage(STORAGE_KEY.C2D_AUTO_START, val)} value={autoStart} />
            </div>
          </div>
        </div>
        <div>
          <div className="divider divider-horizontal"></div>
        </div>
        <div className="subtitle text-align-left mb-1">
          Why we do this extension
        </div>
        <Card>
          <ul>
            <li>မေ့တတ်လို့</li>
            <li>
              ဖုန်းဒေတာစျေးတက်လာလို့ Wifi ရှိတဲ့ သူတွေ ကွန်ပြူတာနဲ့
              ပါဝင်နိုင်အောင်
            </li>
          </ul>
        </Card>

        <div>
          <div className="divider divider-horizontal"></div>
        </div>
        <div className="subtitle text-align-left mb-1">How it worked</div>
        <Card>
          Extension သွင်းထားခြင်းဖြင့် ကိုယ်တိုင် C2D link တွေကို
          ကူးပြီးနှိပ်စရာမလိုပါဘူး Tab တွေသွားဖွင့်စရာမလိုပါဘူးအကယ်လို့မိတ်ဆွေက
          tabတွေကို မပိတ်ဖြစ်ရင်တောင် မိတ်ဆွေသတ်မှတ်ထားတဲ့ အချိန်မှာ
          သူ့အလိုလိုပိတ်ပေးပါမယ်
        </Card>
        <div>
          <div className="divider divider-horizontal"></div>
        </div>
        <div className="subtitle text-align-left mb-1">
          Privacy of user Data{" "}
        </div>
        <Card>
          ဒီ Extention က User ရဲ့ မည်သည့် အချက်အလက်ကိုမျှ မည်သည့်နည်းနှင့်မဆို
          ရယူသုံးစွဲခြင်းမရှိပါ။
        </Card>

        <div>
          <div className="divider divider-horizontal"></div>
        </div>
        <div className="subtitle text-align-left mb-1">
          Code ကို ဘယ်မှာကြည့်လို့ရမလဲ
        </div>
        <Card>http://github.com</Card>
      </div>
    </>
  );
};

export default Setting;
