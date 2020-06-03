import os
import time
import math
import numpy as np
import numpy.linalg as npla
import scipy
import scipy.sparse.linalg as spla
from scipy import sparse
from scipy import linalg
import matplotlib.pyplot as plt
from matplotlib import cm
from mpl_toolkits.mplot3d import axes3d
# %matplotlib tk

def make_M_from_E(E):
    """Make the PageRank matrix from the adjacency matrix of a graph.
        Not for sparse matrices.
    """
    n = E.shape[0]
    outdegree = np.sum(E,0)
    for j in range(n):
        if outdegree[j] == 0:
            E[:,j] = np.ones(n)
            E[j,j] = 0
    A = E / np.sum(E,0)
    S = np.ones((n,n)) / n
    m = 0.15
    M = (1 - m) * A + m * S
    return M

E = np.array([[0,1,1,0,0,0],[0,0,1,0,1,0],[0,0,0,0,0,1],[0,0,1,0,0,0],[0,1,1,0,0,0],[0,0,1,1,0,0]])

n = E.shape[0]
outdegree = np.sum(E,0)
for j in range(n):
    if outdegree[j] == 0:
        E[:,j] = np.ones(n)
        E[j,j] = 0
A = E / np.sum(E,0)
S = np.ones((n,n)) / n
m = 0.15
M = (1 - m) * A + m * S


d, V = linalg.eig(M)
x = V[:,0]
perm = np.argsort(x)[::-1]
print(perm[:6])
