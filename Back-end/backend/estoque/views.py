from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from .models import Produto, Movimentacao
from .serializers import ProdutoSerializer, MovimentacaoSerializer


class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all().order_by('nome')
    serializer_class = ProdutoSerializer
    permission_classes = [IsAuthenticated]


class MovimentacaoViewSet(viewsets.ModelViewSet):
    queryset = Movimentacao.objects.all().order_by('-data_movimentacao')
    serializer_class = MovimentacaoSerializer
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def perform_create(self, serializer):
        movimentacao = serializer.save(responsavel=self.request.user)
        produto = movimentacao.produto

        if movimentacao.tipo == 'entrada':
            produto.quantidade_atual += movimentacao.quantidade
        else:
            if produto.quantidade_atual < movimentacao.quantidade:
                raise ValueError("Saída maior do que o estoque disponível.")
            produto.quantidade_atual -= movimentacao.quantidade

        produto.save()
