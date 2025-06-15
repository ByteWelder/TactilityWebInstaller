#!/bin/python

import os

def release(name):
    os.system(f"python release.py {name}")

if __name__ == "__main__":
    release('cyd-2432s024c')
    release('cyd-2432s032c')
    release('cyd-4848s040c')
    release('cyd-8048s043c')
    release('cyd-jc2432w328c')
    release('cyd-jc8048w550c')
    release('elecrow-crowpanel-advance-28')
    release('elecrow-crowpanel-advance-35')
    release('elecrow-crowpanel-advance-50')
    release('elecrow-crowpanel-basic-28')
    release('elecrow-crowpanel-basic-35')
    release('elecrow-crowpanel-basic-50')
    release('lilygo-tdeck')
    release('m5stack-core2')
    release('m5stack-cores3')
    release('unphone')
    release('waveshare-s3-touch-43')
