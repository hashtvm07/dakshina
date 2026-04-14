@echo off
setlocal

pushd ui || exit /b 1
call ng build --configuration production || exit /b 1
call firebase deploy || exit /b 1
popd

pushd admin-ui || exit /b 1
call ng build --configuration production || exit /b 1
call firebase deploy || exit /b 1
popd

endlocal
