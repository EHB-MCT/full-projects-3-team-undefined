import RPi.GPIO as GPIO
import time
import vlc

playing = False

vlc_instance = vlc.Instance()

player = vlc_instance.media_player_new()

vlc.libvlc_toggle_fullscreen(player)

media = vlc_instance.media_new("ExportVertView_Fin.mp4")

player.set_media(media)
player.play()
time.sleep(1)
player.pause()

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
PIR_PIN = 4
GPIO.setup(PIR_PIN, GPIO.IN)

print("starting")
time.sleep(1)
print("ready")

while True:
	if GPIO.input(PIR_PIN) and playing == False:
		playing = True
		print("motion detected")
		print(playing)
		vlc.libvlc_media_player_set_position(player, 0.0)
		player.play()
	
	time.sleep(1)
	
	while player.is_playing() and vlc.libvlc_media_player_get_position(player) < 0.98:
		print("playing")
	
	playing = False
	#vlc.libvlc_media_player_set_position(player, 0.0)
	if player.is_playing():
		player.pause()
		time.sleep(10)
