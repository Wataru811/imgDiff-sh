# Image compare script

画像差分スクリプト　使い方

## Usage

0. imagemagick をインストール
1. 作業フォルダ　（rootと呼ぶ）を作成
2. root に確認したい画像グループAをコピー
3. root/diff  に確認したい画像グループBをコピー
4. terminal (console) で root から imgDiff.sh を呼ぶ
5. root/res に差分画像が作成されます


## install
https://macappstore.org/imagemagick/

## 注意事項

- root, diff に入れるファイル名は同名, フォルダ階層は対応しない
- - スペースなど通常linux shell で使わない文字コードの混ざったファル名は対応しない。ただしFigmaなどはスペースを名称に入れるとファイル名にスペースが入るため、これをハイフンに置き換える　safename.sh を同梱しているので、それを使って　　root, diff のファイルはあらかじめスペースがないものにすることができる。


*END*
