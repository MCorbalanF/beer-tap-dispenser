from rest_framework import serializers

#powered by chatgpt, edited by marc

class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField()
    password = serializers.CharField()