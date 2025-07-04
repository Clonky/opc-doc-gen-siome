link_lib:
	npm link opc-doc-gen

create: link_lib
	npm run clean-releases
	npm run build-plugin