#!/usr/bin/env bash

#添加 build android 环境变量
PATH=${PATH}:/Users/suxindao/Library/Android/sdk/build-tools/24.0.2/

#配置输出路径
export apk_path=/Users/suxindao/work/billboard/platforms/android/build/outputs/apk
export build_path=build
export DATE=$(date +"%Y%m%d")

if [ ! -d $build_path ]; then
  mkdir $build_path
fi

rm $build_path/MagicManager-release-$DATE.apk

#生成Key
#keytool -genkeypair -alias migicboard.keystore -keyalg RSA -validity 10000 -keystore migicboard.keystore

ionic build --release android

#jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore $apk_path/android-release-unsigned.apk panocean
jarsigner -verbose -keystore migicboard.keystore -signedjar $build_path/MagicManager-$DATE.apk $apk_path/android-release-unsigned.apk migicboard.keystore

zipalign -f -v 4 $build_path/MagicManager-$DATE.apk $build_path/MagicManager-release-$DATE.apk

rm $build_path/MagicManager-$DATE.apk
