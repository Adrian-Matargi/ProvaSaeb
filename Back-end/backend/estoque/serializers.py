from rest_framework import serializers
from .models import Produto, Movimentacao
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class ProdutoSerializer(serializers.ModelSerializer):
    estoque_baixo = serializers.ReadOnlyField()

    class Meta:
        model = Produto
        fields = '__all__'


class MovimentacaoSerializer(serializers.ModelSerializer):
    produto_nome = serializers.ReadOnlyField(source='produto.nome')
    responsavel_username = serializers.ReadOnlyField(source='responsavel.username')

    class Meta:
        model = Movimentacao
        fields = '__all__'
        read_only_fields = ['responsavel']  # impede o front de enviar
