import React from "react";
import "./index.css";
import Select from "../../component/select";
import Card from "../../component/card";
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
const Setting = () => (
  <>
    <div>
      <a className="title setting-title">Setting</a>
      <div>
        <div className="divider divider-horizontal"></div>
      </div>
      <div className="container horizontal">
      <div className="container vertical flex-grow">
        <div>
          <Select
            options={TIME_INTERVALS}
            selectedOption={{ label: "30 minutes", value: 1.8e6 }}
            label="Tabs Show up Interval"
            onMenuItemClick={() => {
              console.log();
            }}
          />
        </div>
        <div>
          <Select
            options={MINIMUM_Tabs}
            selectedOption={{ label: "4 Tabs", value: 4 }}
            label="Minimum Tabs to Show"
            onMenuItemClick={() => {
              console.log();
            }}
          />
        </div>
      </div>
      <div>
        <div className="divider divider-vertical"></div>
      </div>
      <div className="container vertical flex-grow">
        <div>
          <Select
            options={TIME_INTERVALS}
            selectedOption={{ label: "30 minutes", value: 1.8e6 }}
            label="Tabs Show up Interval"
            onMenuItemClick={() => {
              console.log();
            }}
          />
        </div>
        <div>
          <Select
            options={MINIMUM_Tabs}
            selectedOption={{ label: "4 Tabs", value: 4 }}
            label="Minimum Tabs to Show"
            onMenuItemClick={() => {
              console.log();
            }}
          />
        </div>
      </div>
      </div>
      <div>
        <div className="divider divider-horizontal"></div>
      </div>
      <div className="subtitle text-align-left">Why we do this extension</div>
      <Card></Card>
    </div>
  </>
);

export default Setting;
