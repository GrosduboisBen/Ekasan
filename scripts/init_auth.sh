#!/usr/bin/expect
set arg [lindex $argv 0]
set pass [expr {"$arg"}]

cd ./Ekasan-API

spawn python3 main/manage.py createsuperuser --username=admin
expect "Email address:"
send "\n"
expect "Password:"
send "$pass\n"
expect "Password (again):"
send "$pass\n"
expect eof