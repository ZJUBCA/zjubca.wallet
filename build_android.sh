#!/bin/sh

set -e

folder="android-deploy"
file="zjubca_wallet.keystore"
target="platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk"
copy_target="$folder/app-release-unsigned.apk"

if [ ! -f "$folder/zjubca_wallet.keystore" ]; then
  echo "Keystore file not found. Please contact the admin."
  exit
fi

if [ -f "$folder/zjubca_wallet.apk" ]; then
  rm $folder/zjubca_wallet.apk
fi


cp $target $copy_target # copy the release apk to `keystore` dir

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore "$folder/$file" $copy_target zjubca.wallet

zipalign -v 4 $copy_target $folder/zjubca_wallet.apk

rm $copy_target
