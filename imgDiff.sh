mkdir res
# for file in $(find . -maxdepth 1 -name '*.png'); do
for file in *.png;
do
	composite  -compose difference ${file} ./diff/${file} res/${file}
	v=$(identify -format "%[mean]" ./res/${file})
	magick compare -compose src ${file} ./diff/${file} res/${file}
	if [ "$v" = "0" ]; then
		rm ./res/${file}
	fi
done
ls ./res

