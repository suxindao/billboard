#!/usr/bin/env bash
export apk_path=/Users/suxindao/work/billboard/platforms/android/build/outputs/apk
export build_path=build
export DATE=$(date +"%Y%m%d")

if [ ! -d $build_path ]; then
  mkdir $build_path
fi

rm $build_path/MagicManager-release-$DATE.apk

ionic build --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore $apk_path/android-release-unsigned.apk panocean
zipalign -f -v 4 $apk_path/android-release-unsigned.apk $build_path/MagicManager-release-$DATE.apk
