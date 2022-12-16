import React, {useState} from 'react';

import { Slider } from 'antd';

import {useThemeContext} from '../../context/themeContext';

// import Slider from '@material-ui/core/Slider';

import { Input } from 'antd';
// import 'antd/dist/antd.css';
import styles from './input-slider.module.less';


export default function InputSlider({value = {inp1: 0, inp2: 0}, maxValues, step, onChange, disabled=false}) {
      
    const theme = useThemeContext();

    const onValueChange = (e, tValue) => {
      
      let curValue = tValue ? tValue : +e.target.value;

      if (!isNaN(curValue)) {

        onChange?.({...value, [e.target.id] : curValue});
        
      }

    };


    const onLeaveInput = (e) => {
      let targetValue = +e.target.value;

      targetValue =
        targetValue < maxValues[0]
          ? maxValues[0]
          : targetValue;
      targetValue =
        targetValue > maxValues[1]
          ? maxValues[1]
          : targetValue;

      onValueChange(e, targetValue);
    };

    const onSliderChange = (value) => {
      onChange?.( {inp1: value[0], inp2: value[1]} );
    };


    // const inpClass = inputClass ? inputClass : styles.inputSliderInput;

    return (
      <div className={styles.inputSlider}>
        <Input
          id="inp1"
          style={{height: `${theme?.elementHeight}px`, width: "100%", fontSize: "15px"}}
          min={maxValues[0]}
          max={maxValues[1]}
          onBlur={onLeaveInput}
          onChange={onValueChange}
          value={value !== null ? value.inp1 : maxValues[0]}
          disabled = {disabled}
        />

        <Input
          id="inp2"
          style={{height: `${theme?.elementHeight}px` , width: "100%", fontSize: "15px"}}
          min={maxValues[0]}
          max={maxValues[1]}
          onBlur={onLeaveInput}
          onChange={onValueChange}
          value={value !== null ? value.inp2 : maxValues[1]}
          disabled = {disabled}
        />
        <div className={styles.sliderBlock}>
          <Slider
            range
            tooltipVisible={false}
            value={value !== null ? Object.values(value) : maxValues}
            min={maxValues[0]}
            max={maxValues[1]}
            step={step}
            onChange={onSliderChange}
            disabled = {disabled}
          />
        </div>
      </div>
    );
}
