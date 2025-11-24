from rest_framework import serializers
from .models import Produto, Movimentacao

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
