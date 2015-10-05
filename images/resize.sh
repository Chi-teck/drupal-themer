#!/bin/bash

for i in 16 32 64 128
do
  convert source-enabled.png -resize $ix$i $i-enabled.png
  convert source-disabled.png -resize $ix$i $i-disabled.png
done
