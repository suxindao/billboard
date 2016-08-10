ionic build --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore /Users/suxindao/work/billboard/platforms/android/build/outputs/apk/android-release-unsigned.apk panocean
zipalign -v 4 /Users/suxindao/work/billboard/platforms/android/build/outputs/apk/android-release-unsigned.apk /Users/suxindao/work/billboard/platforms/android/build/outputs/apk/MagicManager-release.apk
