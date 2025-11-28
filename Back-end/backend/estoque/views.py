from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from .models import Produto, Movimentacao
from .serializers import ProdutoSerializer, MovimentacaoSerializer, UserSerializer 
from django.contrib.auth import get_user_model
from rest_framework.decorators import action
from rest_framework.response import Response

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    # Rota customizada para o usuário logado
    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


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