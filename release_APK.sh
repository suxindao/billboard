#!/usr/bin/env bash
export apk_path=/Users/suxindao/work/billboard/platforms/android/build/outputs/apk
export DATE=$(date +"%Y%m%d")

ionic build --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore $apk_path/android-release-unsigned.apk panocean
rm ./MagicManager-release-$DATE.apk
zipalign -v 4 $apk_path/android-release-unsigned.apk ./MagicManager-release-$DATE.apk
